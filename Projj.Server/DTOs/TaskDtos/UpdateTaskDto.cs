namespace Projj.Server.DTOs.TaskDtos
{
    public class UpdateTaskDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public DateTime? DueByDate { get; set; }
        public bool? IsCompleted { get; set; }
    }
}