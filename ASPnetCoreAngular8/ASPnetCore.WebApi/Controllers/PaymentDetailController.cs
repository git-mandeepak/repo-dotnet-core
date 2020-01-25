using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using ASPnetCore.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ASPnetCore.WebApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class PaymentDetailController : ControllerBase
    {
        private readonly PaymentDetailContext _context;

        public PaymentDetailController(PaymentDetailContext context)
        {
            _context = context;
        }

        
        [HttpGet, Route("get")]
        [Produces("application/json")]
        public async Task<ActionResult<IEnumerable<PaymentDetail>>> GetPaymentDetail()
        {
            var result = await _context.PaymentDetails.ToListAsync();
            return new JsonResult(result);
        }

        // Post: api/PaymentDetail/5
        [HttpGet("{id}")]
        [Produces("application/json")]
        public async Task<ActionResult<PaymentDetail>> GetPaymentDetail(int id)
        {
            var result = await _context.PaymentDetails.FindAsync(id);
            if (result == null)
            {
                return NotFound();
            }

            return new JsonResult(result);
        }

        // Post: api/PaymentDetail/add
        [HttpPost, Route("add")]
        public async Task<ActionResult<PaymentDetail>> AddPaymentDetail(PaymentDetail paymentDetail)
        {
            try
            {
                await _context.PaymentDetails.AddAsync(paymentDetail);
                await _context.SaveChangesAsync();
                //return Ok(paymentDetail);
                return CreatedAtAction("GetPaymentDetail", new { id = paymentDetail.PMId }, paymentDetail);
            }
            catch (Exception ex)
            {
                return BadRequest($"Portal Error: {ex}");
            }
        }

        // Post: api/PaymentDetail/update/5
        [HttpPut, Route("update/{id}")]
        public async Task<ActionResult<PaymentDetail>> UpdatePaymentDetail(int id, PaymentDetail paymentDetail)
        {
            try
            {
                if (id != paymentDetail.PMId)
                {
                    return BadRequest();
                }

                _context.Entry(paymentDetail).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                //return Ok(paymentDetail);
                return NoContent();
                //return CreatedAtAction("GetPaymentDetail", new { id = paymentDetail.PMId }, paymentDetail);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentDetailExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        private bool PaymentDetailExists(int id)
        {
            return _context.PaymentDetails.Any(x => x.PMId == id);
        }
    }
}
