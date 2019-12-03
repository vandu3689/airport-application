import '../styles/index.scss';
import data from '../assets/airports.json';
import datepicker from 'js-datepicker';

class Airport {
	
	constructor() {
		// Objects
		this.formData = {};
		this.myRequestObj = new Request("./src/assets/airports.json");
		this.formSubmit =  document.getElementById('js-search');
		this.picker = datepicker('#depDate');
		this.formSubmit.addEventListener('click', (e) => this.filterJsonData(e));
	}
	
	//filter json method	
	filterJsonData(e) {
		e.preventDefault();
		let formElements=document.getElementById("my-form").elements;    

		for (let i=0; i<formElements.length; i++) {
			if (formElements[i].type!="submit") { //we dont want to include the submit-buttom
				this.formData[i]=formElements[i].value;
			}	
		}		
		this.fetchdata(this.formData);
		
	} 
	
	//display data in object literal
	fetchdata(nameValue) {
			//alert(1);
			fetch(this.myRequestObj) 
			.then(function(res) {
				return res.json();
			})
			.then(function(data) {
					
				if(nameValue !="" && nameValue !=undefined) {
					var returnVal = airportObject.getObjects(data,'', '', nameValue);
					airportObject.displayData(returnVal);
				} else {
					airportObject.displayData(data);
				}
			});
	}
	
	
	displayData(data) {
		document.getElementById("ajax-content").innerHTML = `
		<h1 class="app-title">All Flight Data (${data.length} results)</h1>
			${data.map(airportObject.airportTemplate).join("")}
		`;
	}
	//filter form data from fetch api response
	getObjects(obj, key, val, formarr) {
		let objects = [];
		
		for (let i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
				if (typeof obj[i] == 'object') {
					objects = objects.concat(airportObject.getObjects(obj[i], key, val, formarr));    
				} else {
					for( var vanz in formarr) {
				
						let uppercaseVal = formarr[vanz].charAt(0).toUpperCase() + formarr[vanz].slice(1);
						
						let searchKey = formarr[vanz].toLowerCase();	
						//if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
						if (i == key && obj[i] == val || i == key && val == '') { 
							objects.push(obj);
						} else if ( obj[i] == uppercaseVal && key == ''){
							
							//only add if the object is not already in the array
							if (objects.lastIndexOf(obj) == -1){
								objects.push(obj);
							}
						}
					
					}
				}
		}
		//console.log(objects);
		return objects;
	}
	
	
	//Airport Header data
	airportTemplate(travelDetails) {
	
		let car = travelDetails.TravelOptions;
		return `
		<div class="header">
		<div class="left-data">
			${travelDetails.Origin} > ${travelDetails.Destination} 
		</div>
		
		
		<div class="right-data">
			<span class="depart"> Depart : ${travelDetails.DepartureDateTime} </span>
			<span class="depart"> Arrive : ${travelDetails.ArrivalDateTime} </span>
			
		</div>
		</div>
		
		<div class="travelDetail--block">
			${car.map(airportObject.airportCareer).join("")}
		</div>
		
		`;
	
	}
	
	//Carrier array of airport json
	airportCareer(career) {
	
	  let portWays = career.Carrier;	
	  return `
		<div class="carrier--details">
		<h4>${career.TravelPrice}</h4>
		<div class="carrierWrapper">
			
		${portWays.map(airportObject.portOptions).join("")}
		<div class="book--flight">
		<button class="btn btn-primary">Book this Flight</button>
		</div>
		
		</div>
		
		</div>
		`;
	}

	//depart and arrive values
	portOptions(port) {
	  return `
		<ul>
		<li><span class="station--code">${port.Code}</span></li>
		<li>Depart : ${port.Depart}</li>
		<li>Arrive : ${port.Arrive}</li>
		<li>${port.Station}</li>
		</ul>
		`;
	}
}


//instantaiating class
let airportObject = new Airport();
airportObject.fetchdata();
