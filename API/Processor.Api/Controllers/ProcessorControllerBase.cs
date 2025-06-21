using Microsoft.AspNetCore.Mvc;
using Processor.Api.Attributes;

namespace Processor.Api.Controllers
{
    //This is done in a base class so that the attribute doesn't have to be applied everywhere
    [BearerTokenFilter]
    public class ProcessorControllerBase : ControllerBase
    {

    }
}
