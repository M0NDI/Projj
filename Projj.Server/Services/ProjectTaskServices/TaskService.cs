using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Projj.Server.Data;
using Projj.Server.DTOs.TaskDtos;
using Projj.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Projj.Server.Services.ProjectTaskServices
{
    public class TaskService : ITaskService
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public TaskService(IMapper mapper, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _mapper = mapper;
            _context = context;
            _userManager = userManager;
        }

        public async Task<ProjectTask> AddTaskAsync(ClaimsPrincipal userPrincipal, int projectId, AddTaskDto model)
        {
            var currentUser = await _userManager.GetUserAsync(userPrincipal);
            if (currentUser == null)
            {
                throw new InvalidOperationException("Error fetching user");
            }

            var project = await _context.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.UserId == currentUser.Id && p.Id == projectId);
            if (project == null)
            {
                throw new InvalidOperationException("Error fetching projects");
            }

            var task = _mapper.Map<ProjectTask>(model);

            project.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return task; // Return the full ProjectTask instance
        }

        public async Task<ProjectTask> UpdateTaskAsync(ClaimsPrincipal userPrincipal, int taskId, UpdateTaskDto model)
        {
            if (model == null)
            {
                throw new ArgumentNullException(nameof(model));
            }

            var currentUser = await _userManager.GetUserAsync(userPrincipal);

            if (currentUser == null)
            {
                throw new InvalidOperationException("Error fetching user");
            }

            var taskToUpdate = await _context.ProjectTasks
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (taskToUpdate == null)
            {
                throw new InvalidOperationException("Task not found");
            }

            // This allows updating of only properties a user inputs new data for.
            // Properties without new data sent in the request will not be changed
            // in the database.
            var taskType = typeof(ProjectTask);
            var dtoType = typeof(UpdateTaskDto);
            var propertiesToUpdate = dtoType.GetProperties()
                .Where(p =>
                {
                    var value = p.GetValue(model);
                    return value != null && (!string.IsNullOrEmpty(value.ToString()));
                });

            foreach (var property in propertiesToUpdate)
            {
                var propertyName = property.Name;
                var newValue = property.GetValue(model);

                var taskProperty = taskType.GetProperty(propertyName);
                if (taskProperty != null && taskProperty.CanWrite)
                {
                    taskProperty.SetValue(taskToUpdate, newValue);
                }
            }

            // Save the changes to persist the updates in the database
            await _context.SaveChangesAsync();

            return taskToUpdate;
        }

        public async Task<ProjectTask> DeleteTaskAsync(ClaimsPrincipal userPrincipal, int taskId)
        {
            try
            {
                var currentUser = await _userManager.GetUserAsync(userPrincipal);
                if (currentUser == null)
                {
                    throw new InvalidOperationException("Error fetching user.");
                }

                var taskToDelete = await _context.ProjectTasks.FirstOrDefaultAsync(t => t.Id == taskId);
                if (taskToDelete == null)
                {
                    throw new InvalidOperationException("Task could not be found.");
                }

                _context.Remove(taskToDelete);
                await _context.SaveChangesAsync();
                return taskToDelete;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<GetTasksDto>> GetAllTasksAsync()
        {
            var tasks = await _context.ProjectTasks.ToListAsync();
            var tasksDto = _mapper.Map<IEnumerable<GetTasksDto>>(tasks);
            return tasksDto;
        }

        public async Task<IEnumerable<GetTasksDto>> GetCurrentProjectTasksAsync(ClaimsPrincipal userPrincipal, int projectId)
        {
            var currentUser = await _userManager.GetUserAsync(userPrincipal);

            if (currentUser == null)
            {
                throw new InvalidOperationException("Error fetching user");
            }

            var tasks = await _context.ProjectTasks.Where((t) => t.ProjectId == projectId).ToListAsync();
            var tasksDto = _mapper.Map<IEnumerable<GetTasksDto>>(tasks);
            return tasksDto;
        }

        public async Task<ProjectTask> GetTaskByIdAsync(ClaimsPrincipal userPrincipal, int id)
        {
            var currentUser = await _userManager.GetUserAsync(userPrincipal);
            if (currentUser == null)
            {
                throw new InvalidOperationException("Error fetching user.");
            }

            var task = await _context.ProjectTasks.FirstOrDefaultAsync(t => t.Id == id);
            var taskDto = _mapper.Map<ProjectTask>(task);
            return taskDto;
        }
    }
}
