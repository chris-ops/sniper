let KEYGEN_LICENSE_ID = '';
let fingerprint = '';
let isActivated = validateKey();
// Initialize an agent at application startup.
function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
  if (isActivated)
  {
      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
    
      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
    
      // Show the current tab, and add an "active" class to the link that opened the tab
      document.getElementById(cityName).style.display = "block";
      evt.currentTarget.className += " active";
    }
  }
  
  async function activateAppWithLicenseKey(key) {
    KEYGEN_LICENSE_ID = key;
    const date = new Date();
    let fingerprint = date.getFullYear().toString(); 
    fingerprint += date.getMilliseconds().toString();
    fingerprint += date.getHours().toString();
    fingerprint += date.getSeconds().toString();
    fingerprint += date.getMinutes().toString();

      const fetch = require("node-fetch")
 
      const response = await fetch("https://api.keygen.sh/v1/accounts/picayunebr/machines", {
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.api+json",
          "Accept": "application/vnd.api+json",
          "Authorization": "Bearer admin-1e73bc24f9563768e9acb692649503ba82abc2a9dd379a8fe20f45b0eee3c4fav3"
        },
        body: JSON.stringify({
          "data": {
            "type": "machines",
            "attributes": {
              "fingerprint": fingerprint,
            },
            "relationships": {
              "license": {
                "data": {
                  "type": "licenses",
                  "id": key
                }
              }
            }
          }
        })
      })
       
    const { data, errors } = await response.json();
    document.getElementById("log").value = fingerprint;

    if (!errors)
    {
      window.localStorage.setItem('licenseKey', key);
      window.localStorage.setItem('fingerprint', fingerprint);
    }
    else
      document.getElementById("log").value = errors;

  }

async function validateKey() 
{
  loadKeys();
  const fetch = require("node-fetch")
  const response = await fetch(`https://api.keygen.sh/v1/accounts/picayunebr/licenses/${KEYGEN_LICENSE_ID}/actions/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
      "Accept": "application/vnd.api+json",
      "Authorization": "Bearer admin-1e73bc24f9563768e9acb692649503ba82abc2a9dd379a8fe20f45b0eee3c4fav3"
    },
    body: JSON.stringify({
      "meta": {
        "scope": {
          "fingerprint": fingerprint
        }
      }
    })
  })
   
  const { meta, data, errors } = await response.json()

  //  if (!meta.valid)
  //  {
  //    document.getElementById("edtContract").readOnly = true;
  //    document.getElementById("amountIn").readOnly = true;
  //    document.getElementById("edtContract").value = "Please register your bot.";
  //    document.getElementById("log").value = "Please register your bot.";
  //  }
  //  else
  //    document.getElementById("botKey").disabled = true;
  //  if (errors)
  //  {
  //    document.getElementById("edtContract").readOnly = true;
  //    document.getElementById("amountIn").readOnly = true;
  //    document.getElementById("edtContract").value = "Please register your bot.";
  //    document.getElementById("log").value = "Please register your bot.";
  //  }
}

async function loadKeys()
{
  KEYGEN_LICENSE_ID = window.localStorage.getItem('licenseKey');
  fingerprint = window.localStorage.getItem('fingerprint');
}