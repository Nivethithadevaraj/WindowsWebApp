using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Students.Models;
using System.Security.Claims;

namespace Students.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly SchoolDbContext _context;

        public UserController(SchoolDbContext context)
        {
            _context = context;
        }

        [HttpGet("me")]
        [Authorize(Roles = "Student,Teacher")]
        public IActionResult GetMyProfile()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) return NotFound("User not found");
            return Ok(user);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Teacher")]
        public IActionResult GetAllUsers()
        {
            return Ok(_context.Users.ToList());
        }

        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public IActionResult AddUser([FromBody] User newUser)
        {
            if (_context.Users.Any(u => u.Email == newUser.Email))
                return BadRequest("User already exists");

            newUser.PasswordHash = AuthController.HashPassword(newUser.PasswordHash);
            _context.Users.Add(newUser);
            _context.SaveChanges();
            return Ok("User added successfully");
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher")]
        public IActionResult UpdateUser(int id, [FromBody] User updated)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound("User not found");

            user.Name = updated.Name;
            user.Email = updated.Email;
            user.Role = updated.Role;
            user.UpdatedDate = DateTime.Now;

            if (!string.IsNullOrEmpty(updated.PasswordHash))
                user.PasswordHash = AuthController.HashPassword(updated.PasswordHash);

            _context.SaveChanges();
            return Ok("User updated successfully");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound("User not found");

            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok("User deleted successfully");
        }
    }
}
