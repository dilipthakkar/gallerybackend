var nodemailer = require('nodemailer');
require('dotenv').config();
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.GMAIL ,
        pass : process.env.PASS
    }
});
 
// setup e-mail data with unicode symbols




 

const sendVerificationMail = (userEmail ,userId ,  emailToken)=>{
    // console.log(userEmail , userId , emailToken);
    const hreflink = `http://localhost:8000/api/emailverify/${userId}/${emailToken}`;
    const alink = `<a  href=${hreflink}>Verify</a>`
        const mailoptions = {
            from: 'imatestieetester@gmail.com', 
            to: userEmail, 
            subject: 'verify for our app', 
            text: `To verify your email to our app copy link and open it in any browser ${emailToken}`, 
            html: "<div>" + 
                "<h3> To verify your email to our app click on the link below </h3> " +
                `<div style="background-color: #4CAF50; /* Green */
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;" ">`+  
                alink +
                "<div>"+
                "<div>"
        }
    return new Promise((resolve , reject)=>{
        transporter.sendMail(mailoptions, function(error, info){
            if(error){
                resolve( {error : error} );
            }
            else {
                resolve({error : false})
            }
        });
    })
    
    
} 
// sendVerificationMail(null,null,"dilipthakkarnew@gmail.com" , "78998767899876");
module.exports = sendVerificationMail;