using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projj.Server.DTOs.TaskDtos;
using Projj.Server.Services.ProjectTaskServices;
using System.Security.Claims;

namespace Projj.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TaskController(TaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpPost]
        [Route("{projectId}")]
        public async Task<ActionResult> AddTaskAsync([FromBody] AddTaskDto model, int projectId)
        {
            var result = await _taskService.AddTaskAsync(User, projectId, model);
            return Ok(result);
        }

        [HttpPatch("{taskId}")]
        public async Task<ActionResult> UpdateTaskAsync(int taskId, [FromBody] UpdateTaskDto model)
        {
            try
            {
                var updatedTask = await _taskService.UpdateTaskAsync(User, taskId, model);
                if (updatedTask == null)
                {
                    return BadRequest();
                }
                return Ok(updatedTask);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{taskId}")]
        public async Task<ActionResult> DeleteTaskAsync(int taskId)
        {
            try
            {
                await _taskService.DeleteTaskAsync(User, taskId);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting task: " + ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("tasks")]
        public async Task<ActionResult> GetAllTasksAsync()
        {
            var result = await _taskService.GetAllTasksAsync();
            return Ok(result);
        }

        [HttpGet("current-project-tasks")]
        public async Task<ActionResult> GetCurrentProjectTasksAsync(int projectId)
        {
            var result = await _taskService.GetCurrentProjectTasksAsync(User, projectId);
            if (result == null)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetTaskByIdAsync(int id)
        {
            var result = await _taskService.GetTaskByIdAsync(User, id);
            return Ok(result);
        }
    }
}