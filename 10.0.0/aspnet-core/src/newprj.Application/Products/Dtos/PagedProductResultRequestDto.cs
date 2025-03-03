using System;
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
    public class PagedProductResultRequetstDto : PagedAndSortedResultRequestDto, IShouldNormalize
    {
        public string Keyword { get; set; }

 
        public string Sorting { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "Name";
            }

            Keyword = Keyword?.Trim();
        }
    }

}