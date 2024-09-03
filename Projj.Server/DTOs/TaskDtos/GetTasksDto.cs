namespace Projj.Server.DTOs.TaskDtos
{
    public class GetTasksDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public DateTime? DueByDate { get; set; }
        public bool IsCompleted { get; set; } = false;
        public int ProjectId { get; set; }
    }
}