﻿ using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;
using Microsoft.Build.Framework;
using newprj.Authorization.Users;

namespace newprj.Entities
{
    public class Cart: FullAuditedEntity<int>
    {
        [Required]
        public long UserId { get; set; } // ID người dùng
        public virtual User User { get; set; } // Navigation property

       
        public virtual ICollection<CartItem> CartItems { get; set; }
    }

   


}
