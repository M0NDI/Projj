namespace Projj.Server.DTOs.ProjectDtos
{
    public class UpdateProjectDto
    {
        public string? Name { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string? Status { get; set; } = string.Empty;
        public DateTime? DueByDate { get; set; }
        public DateTime? LastModifiedDate { get; set; } = DateTime.UtcNow;
        public string? LastModifiedBy { get; set; }
    }
}