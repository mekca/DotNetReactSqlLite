using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ASPNETCOREFORM.Models;
using Newtonsoft.Json;

namespace ASPNETCOREFORM.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {

        /*
        
        Instructions:
        Anywhere in the code containing [MyNameClass], change it
        to the name of the class you have defined in your Model.cs file.
         */

        // GET api/values
        [HttpGet]
        public List<Inventory> Get()
        {
            var data = new List<Inventory>();
            using (var db = new InventoryContext())
            {
                data = db.Inventories.ToList();
            }
            return data;

        }

        // POST api/values
        [HttpPost]
        public IActionResult Post([FromBody] Inventory inventory)
        {
            using (var db = new InventoryContext())
            {
                var inventoryInfo =db.Inventories.Where(x => x.Name == inventory.Name);

                if(inventoryInfo.Count() < 1)
                {
                    db.Inventories.Add(inventory);
                    var count = db.SaveChanges();

                }
            }
            return Json("Done");

        }
        /*
           Make sure to create a new instance of 
           inventoryContext. You may refer to your notes or gitbook.
           https://cn1109.gitbooks.io/saintermediate/content/dotnet-core-entityframework.html

           Look under the section: Updating the Values Controller to use Entity Framework
        */

    }
}
