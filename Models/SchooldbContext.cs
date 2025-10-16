using Microsoft.EntityFrameworkCore;

namespace Students.Models
{
    public class SchooldbContext : DbContext
    {
        public SchooldbContext(DbContextOptions<SchooldbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
        }
    }
}
