using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Students.Models;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;

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

        // ✅ Get currently logged-in user's profile (Student & Teacher)
        [HttpGet("me")]
        [Authorize(Roles = "Student,Teacher")]
        public IActionResult GetMyProfile()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null)
                return NotFound("User not found.");

            // Hide password before sending
            user.PasswordHash = null;
            return Ok(user);
        }

        // ✅ Get all users (Teacher only)
        [HttpGet("all")]
        [Authorize(Roles = "Teacher")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users
                .OrderByDescending(u => u.CreatedDate)
                .Select(u => new
                {
                    u.UserId,
                    u.Name,
                    u.Email,
                    u.Role,
                    u.Designation,
                    u.Gender,
                    u.Department,
                    u.PhoneNumber,
                    u.Address,
                    u.DateOfBirth,
                    u.IsActive,
                    u.CreatedDate,
                    u.UpdatedDate
                })
                .ToList();

            return Ok(users);
        }

        // ✅ Add a new user (Teacher only)
        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public IActionResult AddUser([FromBody] User newUser)
        {
            if (string.IsNullOrEmpty(newUser.Name) ||
                string.IsNullOrEmpty(newUser.Email) ||
                string.IsNullOrEmpty(newUser.Role) ||
                string.IsNullOrEmpty(newUser.Gender))
            {
                return BadRequest("Please fill in all required fields.");
            }

            if (_context.Users.Any(u => u.Email == newUser.Email))
                return BadRequest("User already exists.");

            // Default password
            newUser.PasswordHash = AuthController.HashPassword("12345");

            // Fill defaults for NOT NULL columns
            newUser.Designation ??= "N/A";
            newUser.Department ??= "N/A";
            newUser.PhoneNumber ??= "N/A";
            newUser.Address ??= "N/A";
            newUser.DateOfBirth = newUser.DateOfBirth == default ? DateTime.Now : newUser.DateOfBirth;

            // DB metadata
            newUser.CreatedDate = DateTime.Now;
            newUser.IsActive = true;

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok("User added successfully with default password (12345).");
        }

        // ✅ Update existing user (Teacher only)

[HttpPut("{id}")]
    [Authorize(Roles = "Teacher")]
    public IActionResult UpdateUser(int id, [FromBody] JsonElement body)
    {
        if (body.ValueKind == JsonValueKind.Undefined || body.ValueKind == JsonValueKind.Null)
            return BadRequest("Invalid request body");

        var user = _context.Users.FirstOrDefault(u => u.UserId == id);
        if (user == null)
            return NotFound();

        // Safely read each property
        if (body.TryGetProperty("name", out JsonElement nameProp))
            user.Name = nameProp.GetString();

        if (body.TryGetProperty("email", out JsonElement emailProp))
            user.Email = emailProp.GetString();

        if (body.TryGetProperty("role", out JsonElement roleProp))
            user.Role = roleProp.GetString();

        if (body.TryGetProperty("designation", out JsonElement desigProp))
            user.Designation = desigProp.GetString();

        if (body.TryGetProperty("gender", out JsonElement genderProp))
            user.Gender = genderProp.GetString();

        if (body.TryGetProperty("department", out JsonElement deptProp))
            user.Department = deptProp.GetString();

        if (body.TryGetProperty("phoneNumber", out JsonElement phoneProp))
            user.PhoneNumber = phoneProp.GetString();

        if (body.TryGetProperty("address", out JsonElement addressProp))
            user.Address = addressProp.GetString();

        if (body.TryGetProperty("dateOfBirth", out JsonElement dobProp))
        {
            if (DateTime.TryParse(dobProp.GetString(), out var dob))
                user.DateOfBirth = dob;
        }

        user.UpdatedDate = DateTime.Now;

        _context.SaveChanges();

        return Ok(new { message = "User updated successfully" });
    }





    // ✅ Soft delete (Teacher only)
    [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound("User not found.");

            user.IsActive = false;
            user.DeletedDate = DateTime.Now;

            _context.Users.Update(user);
            _context.SaveChanges();

            return Ok($"User '{user.Name}' marked as inactive.");
        }
    }
}
public class DateOnlyJsonConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        if (DateTime.TryParse(value, out var date))
            return date;

        return DateTime.Now;
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString("yyyy-MM-dd"));
    }

}