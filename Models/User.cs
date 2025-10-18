using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Students.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public string? Designation { get; set; }
        public string? Department { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateTime DateOfBirth { get; set; }

        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
    }

}
