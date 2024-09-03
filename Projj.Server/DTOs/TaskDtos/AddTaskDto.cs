namespace Projj.Server.DTOs.TaskDtos
{
    public class AddTaskDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DueByDate { get; set; }
    }
}