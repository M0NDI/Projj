using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projj.Server.DTOs.ProjectDtos;
using Projj.Server.Services.ProjectServices;

namespace Projj.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly ProjectService _projectService;

        public ProjectController(ProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpPost]
        public async Task<ActionResult> AddProjectAsync([FromBody] AddProjectDto model)
        {
            await _projectService.AddProjectAsync(User, model);
            return Ok("Project successfully added");
        }

        [HttpDelete]
        [Route("{projectName}")]
        public async Task<ActionResult> DeleteProjectAsync(string projectName)
        {
            await _projectService.DeleteProjectAsync(User, projectName);
            return Ok($"Project with name '{projectName}' deleted.");
        }

        [HttpGet]
        [Route("current-user-projects")]
        public async Task<ActionResult<IEnumerable<GetProjectsDto>>> GetCurrentUserProjectsAsync()
        {
            var result = await _projectService.GetCurrentUserProjectsAsync(User);
            if (result == null)
            {
                return NotFound("Current user's projects could not be found.");
            }
            else
            {
                return Ok(result);
            }
        }

        [HttpGet]
        [Route("{projectId}")]
        public async Task<ActionResult> GetProjectById(int projectId)
        {
            var project = await _projectService.ProjectById(User, projectId);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }

        [HttpPatch]
        [Route("{projectId}")]
        public async Task<ActionResult> UpdateProjectAsync([FromBody] UpdateProjectDto model, int projectId)
        {
            var result = await _projectService.UpdateProjectAsync(User, model, projectId);
            return Ok(result);
        }
    }
}
