using Projj.Server.DTOs.TaskDtos;
using Projj.Server.Models;
using System.Security.Claims;

namespace Projj.Server.Services.ProjectTaskServices
{
    public interface ITaskService
    {
        public Task<IEnumerable<GetTasksDto>> GetAllTasksAsync();
        public Task<IEnumerable<GetTasksDto>> GetCurrentProjectTasksAsync(ClaimsPrincipal principal, int projectId);
        public Task<ProjectTask> GetTaskByIdAsync(ClaimsPrincipal userPrincipal, int id);
        public Task<ProjectTask> AddTaskAsync(ClaimsPrincipal userPrincipal, int projectId, AddTaskDto model);
        public Task<ProjectTask> UpdateTaskAsync(ClaimsPrincipal userPrincipal, int taskId, UpdateTaskDto model);
        public Task<ProjectTask> DeleteTaskAsync(ClaimsPrincipal userPrincipal, int taskId);
    }
}