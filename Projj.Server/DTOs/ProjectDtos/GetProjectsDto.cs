using Projj.Server.DTOs.TaskDtos;
using Projj.Server.Models;

namespace Projj.Server.DTOs.ProjectDtos
{
    public class GetProjectsDto
    {
        public int Id { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "In progress";
        public double Progress { get; set; }
        public DateTime StartDate { get; set; } = DateTime.Now;
        public DateTime? DueByDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public string LastModifiedBy { get; set; } = string.Empty;
        public ICollection<GetTasksDto> Tasks { get; set; } = new List<GetTasksDto>();
    }
}