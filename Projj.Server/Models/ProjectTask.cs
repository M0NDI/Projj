using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Projj.Server.Models
{
    public class ProjectTask
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Project")]
        public int ProjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string? Status { get; set; } = "In progress";
        public string? Priority { get; set; } = "Normal";
        public DateTime? DueByDate { get; set; } = DateTime.Now;
        public bool IsCompleted { get; set; } = false;
        public Project Project { get; set; } = new Project();
    }
}