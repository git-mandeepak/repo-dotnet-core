using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ASPnetCore.WebApi.Models
{
    public class PaymentDetailContext: IdentityDbContext
    {
        public PaymentDetailContext(DbContextOptions<PaymentDetailContext> options)
            :base(options)
        {

        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<PaymentDetail> PaymentDetails { get; set; }
    }
}
