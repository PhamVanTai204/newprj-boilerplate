﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Runtime.Validation;
using newprj.Entities;

namespace newprj.Products.Dtos
{
    public class PagedProductResultRequetstDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
     
       
    }

}
