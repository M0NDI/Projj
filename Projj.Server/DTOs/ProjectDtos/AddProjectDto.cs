using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Projj.Server.DTOs.ProjectDtos
{
    public class AddProjectDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueByDate { get; set; }
    }
}