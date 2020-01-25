using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ASPnetCore.WebApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ASPnetCore.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private SignInManager<ApplicationUser> _signInManager;
        ApplicationSettings _appSettings;

        public ApplicationUserController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;

        }

        [HttpPost, Route("Register")]
        // POST: /api/ApplicationUser/Register
        public async Task<ActionResult<IdentityResult>> PostApplicationUser(ApplicationUserModel model)
        {
            model.Role = "Admin";
            var applicationUser = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName
            };

            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                await _userManager.AddToRoleAsync(applicationUser, model.Role);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Portal Error: {ex}");
            }
        }

        [HttpPost, Route("Login")]
        // POST: /api/ApplicationUser/Login
        public async Task<IActionResult> Login(LoginModel model)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(model.UserName);
                if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    // Get role assigned to the user
                    var role = await _userManager.GetRolesAsync(user);
                    IdentityOptions _options = new IdentityOptions();


                    var tokenDescriptor = new SecurityTokenDescriptor()
                    {
                        Subject = new ClaimsIdentity(new Claim[] {
                            new Claim("UserID", user.Id.ToString()),
                            new Claim("FullName", user.FullName),
                            new Claim("Email", user.Email),
                            new Claim(_options.ClaimsIdentity.RoleClaimType, role.FirstOrDefault())
                        }),
                        Expires = DateTime.UtcNow.AddMinutes(5),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature) //SecurityAlgorithms.HmacSha512
                    };

                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                    var token = tokenHandler.WriteToken(securityToken);
                    return Ok(new { token }); // using this response can be what is mentioned in accept headers with 200 status code
                    //return new JsonResult(new { token }); // using this response is JSON always with 200 status code
                }
                else
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { message = "Username or password incorrect." });
                    //return BadRequest(new { message = "Username or password incorrect."});
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Portal Error: {ex}");
            }
        }
    }
}
