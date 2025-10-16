using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Students.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("userid")]
        public int UserId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; }

        [Required]
        [Column("email")]
        public string Email { get; set; }

        [Required]
        [Column("passwordhash")]
        public string PasswordHash { get; set; }

        [Required]
        [Column("role")]
        public string Role { get; set; }

        [Required]
        [Column("dateofbirth")]
        public DateTime DateOfBirth { get; set; }

        [Column("age")]
        public int? Age { get; set; }

        [Column("gender")]
        public string Gender { get; set; }

        [Column("designation")]
        public string Designation { get; set; }

        [Column("department")]
        public string Department { get; set; }

        [Column("phonenumber")]
        public string PhoneNumber { get; set; }

        [Column("address")]
        public string Address { get; set; }

        [Column("profilepicurl")]
        public string ProfilePicUrl { get; set; }

        [Column("isactive")]
        public bool? IsActive { get; set; }

        [Column("createddate")]
        public DateTime? CreatedDate { get; set; }

        [Column("updateddate")]
        public DateTime? UpdatedDate { get; set; }

        [Column("deleteddate")]
        public DateTime? DeletedDate { get; set; }
    }
}
