using Projj.Server.DTOs.ProjectDtos;
using Projj.Server.Models;
using System.Security.Claims;

namespace Projj.Server.Services.ProjectServices
{
    public interface IProjectService
    {
        Task AddProjectAsync(ClaimsPrincipal userPrincipal, AddProjectDto model);
        Task<UpdateProjectDto> UpdateProjectAsync(ClaimsPrincipal userPrincipal, UpdateProjectDto model, int projectId);
        Task DeleteProjectAsync(ClaimsPrincipal userPrincipal, string projectName);
        Task<IEnumerable<GetProjectsDto>> GetCurrentUserProjectsAsync(ClaimsPrincipal userPrincipal);
        Task<GetProjectsDto>ProjectById(ClaimsPrincipal userPrincipal, int projectId);
    }
}