using Microsoft.EntityFrameworkCore;

namespace Students.Models
{
    public class SchoolDbContext : DbContext
    {
        public SchoolDbContext(DbContextOptions<SchoolDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
