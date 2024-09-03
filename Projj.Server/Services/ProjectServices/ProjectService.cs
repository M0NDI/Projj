using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Projj.Server.Data;
using Projj.Server.DTOs.ProjectDtos;
using Projj.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Projj.Server.Services.ProjectServices
{
    public class ProjectService : IProjectService
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public ProjectService(IMapper mapper,
                              UserManager<ApplicationUser> userManager,
                              ApplicationDbContext context)
        {
            _mapper = mapper;
            _userManager = userManager;
            _context = context;
        }

        public async Task AddProjectAsync(ClaimsPrincipal userPrincipal, AddProjectDto model)
        {
            try
            {
                var currentUser = await _userManager.GetUserAsync(userPrincipal);
                if (currentUser == null)
                {
                    throw new InvalidOperationException("Error fetching user.");
                }

                var projectToAdd = new Project
                {
                    Name = model.Name,
                    Description = model.Description,
                    CreatedBy = currentUser.UserName,
                    DueByDate = model.DueByDate,
                    UserId = currentUser.Id
                };

                _context.Projects.Add(projectToAdd);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteProjectAsync(ClaimsPrincipal userPrincipal, string name)
        {
            try
            {
                var currentUser = await _userManager.GetUserAsync(userPrincipal);
                if (currentUser == null)
                {
                    throw new InvalidOperationException("Error fetching user.");
                }

                var projectToDelete = _context.Projects
                    .FirstOrDefault(p => p.UserId == currentUser.Id && p.Name == name);

                if (projectToDelete == null)
                {
                    throw new InvalidOperationException("Project not found.");
                }

                _context.Projects.Remove(projectToDelete);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<GetProjectsDto>> GetCurrentUserProjectsAsync(ClaimsPrincipal userPrincipal)
        {
            try
            {
                var currentUser = await _userManager.GetUserAsync(userPrincipal);
                if (currentUser == null)
                {
                    throw new InvalidOperationException("Error fetching user.");
                }

                var projects = await _context.Projects
                    .Where(p => p.UserId == currentUser.Id)
                    .Include(p => p.Tasks)
                    .ToListAsync();

                var projectsDto = _mapper.Map<IEnumerable<GetProjectsDto>>(projects);

                return projectsDto;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<GetProjectsDto> ProjectById(ClaimsPrincipal userPrincipal, int projectId)
        {
            try
            {
                var currentUser = await _userManager.GetUserAsync(userPrincipal);
                if (currentUser == null)
                {
                    throw new InvalidOperationException("Error fetching user.");
                }

                var project = await _context.Projects
                    .Include(p => p.Tasks)
                    .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == currentUser.Id);

                if (project == null)
                {
                    throw new InvalidOperationException("Project not found.");
                }

                var projectDto = _mapper.Map<GetProjectsDto>(project);
                return projectDto;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<UpdateProjectDto> UpdateProjectAsync(ClaimsPrincipal userPrincipal, UpdateProjectDto model, int projectId)
        {
            try
            {
                var currentUser = await _userManager.GetUserAsync(userPrincipal);
                if (currentUser == null)
                {
                    throw new InvalidOperationException("Error fetching user.");
                }

                var projectToUpdate = await _context.Projects
                    .FirstOrDefaultAsync(p => p.UserId == currentUser.Id && p.Id == projectId);

                if (projectToUpdate == null)
                {
                    throw new InvalidOperationException("Project not found.");
                }

                model.LastModifiedBy = currentUser.UserName;

                var projectType = typeof(Project);
                var dtoType = typeof(UpdateProjectDto);
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

                    var projectProperty = projectType.GetProperty(propertyName);
                    if (projectProperty != null && projectProperty.CanWrite)
                    {
                        projectProperty.SetValue(projectToUpdate, newValue);
                    }
                }

                await _context.SaveChangesAsync();

                var updatedDto = _mapper.Map<UpdateProjectDto>(projectToUpdate);
                return updatedDto;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
