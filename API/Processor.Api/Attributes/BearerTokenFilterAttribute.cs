using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Processor.Api.Controllers;

namespace Processor.Api.Attributes
{
    public class BearerTokenFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            //Here we would check to see if the bearer token is valid
            var authHeader = context.HttpContext.Request.Headers["Authorization"].ToString();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                //Under a normal scenario would would validate the token at this point, for this exercies we will just be validating to make sure the bearer token is present.
                base.OnActionExecuting(context);
                return;                 
            }

            context.Result = new UnauthorizedObjectResult(new { message = "Unauthorized: Bearer token is missing or invalid." });

            base.OnActionExecuting(context);
        }
    }
}
