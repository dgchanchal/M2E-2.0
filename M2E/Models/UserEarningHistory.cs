//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace M2E.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class UserEarningHistory
    {
        public int Id { get; set; }
        public string username { get; set; }
        public string type { get; set; }
        public string subtype { get; set; }
        public string paymentMode { get; set; }
        public string title { get; set; }
        public string amount { get; set; }
        public System.DateTime dateTime { get; set; }
        public string userType { get; set; }
        public string currency { get; set; }
    }
}
