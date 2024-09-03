
using AutoMapper;
using Projj.Server.DTOs.ProjectDtos;
using Projj.Server.DTOs.TaskDtos;
using Projj.Server.Models;

namespace Projj.Server.AutoMapper
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {
            // Project
            CreateMap<Project, GetProjectsDto>();
            CreateMap<Project, UpdateProjectDto>();

            // ProjectTask
            CreateMap<ProjectTask, GetTasksDto>();
            CreateMap<ProjectTask, AddTaskDto>();
            CreateMap<ProjectTask, UpdateTaskDto>();
            CreateMap<UpdateTaskDto, ProjectTask>();
            CreateMap<AddTaskDto, ProjectTask>();

        }
    }
}