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
        public List<Inventory> Get() //pulls the info from database list
        {
            var data = new List<Inventory>(); //formats data to a list or array
            using (var db = new InventoryContext()) //identifies which db data will be accessed from
            {
                data = db.Inventories.ToList(); //formats data 
            }
            return data; //returns data

        }
        [HttpGet("{id}")]
        public List<Inventory> Get(int id)
        {
            var data = new List<Inventory>();
            using (var db = new InventoryContext())
            {
                data = db.Inventories.Where(x => x.InventoryId == id).ToList();
            }
            return data;
        }
        /* [HttpGet("{id}")]
         public string Get(int id) //how the info will be pulled and how it will be identified
         {
             using (var db = new InventoryContext()) //identifies the data or database that will be accessed 
             {
                 var inventory = db.Inventories.Where(x => x.InventoryId == id);
                 //runs through data entry and idenfies specific record by Unique id 

                 if (inventory.Count() > 0) // if else statement - if inventory is more than zero run the code below
                 {
                     var inventoryRecord = inventory.SingleOrDefault();
                     //It returns a single specific element from a collection of 
                     //elements if element match found. An exception is thrown, if more than 
                     //one match found for that element in the collection. 
                     //A default value is returned, if no match is found for that element in the collection.
                     db.Remove(inventoryRecord); //removes record or value
                     db.SaveChanges(); //saves the change 

                     return "Done!";
                 }
                 else
                 {
                     return "No records found!"; //No match 
                 }
             }
         }*/

        // POST api/values
        [HttpPost]
        public string Post([FromBody] Inventory value)
        {
            //Console.WriteLine("INVENTORY ID =========== "+ value.InventoryId.ToString());
            //return value.InventoryId.ToString();

            using (var db = new InventoryContext()) //identifies db and data being used
            {

                if (value.InventoryId < 1)
                {
                    Console.WriteLine("===== ADDING NEW RECORD ======");
                    db.Inventories.Add(value);

                } else { 
                    var record = db.Inventories.Where(x => x.InventoryId == value.InventoryId).FirstOrDefault(); 
               
                    Console.WriteLine("-===== edit record====-");
                    record.Name = value.Name;
                    record.Quantity = value.Quantity;
                    record.Description = value.Description;
                    db.Inventories.Update(record);
                }
                    Console.WriteLine("=====save record=====");
                    db.SaveChanges();

                   /* var response = "Id: " + record.InventoryId + "URL: " + record.Name;
                    return Json("Update Done!");*/
                }
              /*  else
                {

                    /*if (inventoryInfo.Count() < 1) 
                    {

                    db.Inventories.Add(inventory);
                    Console.WriteLine("is it updating");

                    var count = db.SaveChanges();
                    Console.WriteLine("is it saving?");

                }
                db.SaveChanges();
            }*/
            return "Add Done!";
        }

        /*
           Make sure to create a new instance of 
           inventoryContext. You may refer to your notes or gitbook.
           https://cn1109.gitbooks.io/saintermediate/content/dotnet-core-entityframework.html

           Look under the section: Updating the Values Controller to use Entity Framework
        */
        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            using (var db = new InventoryContext())
            {
                var inventory = db.Inventories.Where(x => x.InventoryId == id);

                if (inventory.Count() > 0)
                {
                    var inventoryRecord = inventory.SingleOrDefault();
                    db.Remove(inventoryRecord);
                    db.SaveChanges();
                    return "done!";
                }
                else
                {
                    return "No Record Found.";
                }
            }
        }
    }
}