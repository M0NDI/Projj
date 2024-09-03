using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace Projj.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        [JsonPropertyOrder(1)]
        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}