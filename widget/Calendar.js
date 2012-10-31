var CalendarLocale_EN = function()
{
	this.firstDayOfWeek = Calendar.SUNDAY;
};
var CalendarWeekDays_EN = function()
{
	this["long"] = 
	[
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	],
	this["short"] = 
	[
		"Su",
		"Mo",
		"Tu",
		"We",
		"Th",
		"Fr",
		"Sa"
	]			
};
var CalendarWeeksMonths_EN = function()
{
	this["long"] =  [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	this["short"] = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]
};
var CalendarLocale_ES = function()
{
	this.firstDayOfWeek = Calendar.MONDAY;
};
var CalendarWeekDays_ES = function()
{
	this["long"] = 
	[
		"Domingo",
		"Lunes",
		"Martes",
		"Miercoles",
		"Jueves",
		"Viernes",
		"Sabado"
	],
	this["short"] = 
	[		
		"Do",
		"Lu",
		"Ma",
		"Mi",
		"Ju",
		"Vi",
		"Sa"
	]			
};
var CalendarWeeksMonths_ES = function()
{
	this["long"] =  [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre"
	],
	this["short"] = [
		"Ene",
		"Feb",
		"Mar",
		"Abr",
		"May",
		"Jun",
		"Jul",
		"Ago",
		"Sep",
		"Oct",
		"Nov",
		"Dic"
	]
};
var CalendarTexts_EN =	function()
{
	this.weekDays = new CalendarWeekDays_EN();
	this.months = new CalendarWeeksMonths_EN();
	this.prev = "Prev";
	this.next = "Next"
};
var CalendarTexts_ES =	function()
{
	this.weekDays = new CalendarWeekDays_ES();
	this.months = new CalendarWeeksMonths_ES();
	this.prev =  "Prev";
	this.next = "Sig"
};
var CalendarSkin = function()
{
	this.container = "calendar_container";
	this.header = "calendar_header";
	this.month_year = "month_year";
	this.next = "next";
	this.prev = "prev";
	this.month = "month";
	this.year = "year";
	this.body = "calendar_body";
	this.week_days = "week_days";
	this.days = "days";
	this.week = "week";
	this.day = "day";
	this.today = "today";
	this.year_input = "year";
	this.month_input = "month";
};
var Calendar = function()
{
	this.oContainer = null;
	this.oInputHidden = null;	
	this.oMonthSpan = null;
	this.oYearSpan = null;
	this.oHeader = null;
	this.oCalendarBody = null;
	this.oWeekDays = null;
	this.oDays = null;
	this.oDaySelected = null;
	this.oLocale = new CalendarLocale_EN();
	this.oClasses = new CalendarSkin();
	this.oTexts = new CalendarTexts_EN();
	this.nYear = -1;
	this.nMonth = -1;
	this.oMonthYear = null;
	this.nYearSelected = -1;
	this.nMonthSelected = -1;
	this.nDaySelected = 1;	
	this.onSelectDate = function(){};
	this.onChangeMonth = function(){};
};
/*CONSTANTS*/
Calendar.SUNDAY = 0;
Calendar.MONDAY = 1;
Calendar.TUESDAY = 2;
Calendar.WEDNESDAY = 3;
Calendar.THURSDAY = 4;
Calendar.FRIDAY = 5;
Calendar.SATURDAY = 6;

Calendar.JANUARY = 0;
Calendar.FEBRUARY = 1;
Calendar.MARCH = 2;
Calendar.APRIL = 3;
Calendar.MAY = 4;
Calendar.JUNE = 5;
Calendar.JULY = 6;
Calendar.AUGUST = 7;
Calendar.SEPTEMBER = 8;
Calendar.OCTOBER = 9;
Calendar.NOVEMBER = 10;
Calendar.DECEMBER = 11;
/*End CONSTANTS*/
Calendar.prototype.setContainer = function(oContainer)
{
	this.oContainer = oContainer;
	return this;
};
Calendar.prototype.setLocale = function(oLocale)
{
	this.oLocale = oLocale;
	if(this.oWeekDays)
	{
		this.oCalendarBody.removeChild(this.oWeekDays);
		var oWeekDays = this._createWeekDays();
		this.oCalendarBody.appendChild(oWeekDays);
		this._changeDaysHot();
	}
	return this;
};
Calendar.prototype.setDate = function(oDate)
{
	this.nDaySelected = oDate.getDate();
	this.nMonthSelected = oDate.getMonth();
	this.nYearSelected = oDate.getFullYear();
	if(this.oDays)
	{
		this._changeDaysHot();
	}else
	{		
		this.nDay = this.nDaySelected;
		this.nMonth = this.nMonthSelected;
		this.nYear = this.nYearSelected;
	}
	return this;
};
Calendar.prototype.goTo = function(nMonth,nYear)
{
	this.nYear = nYear;
	this.nMonth = nMonth;
	this._changeMonthYearHot();
	this._changeDaysHot();
}
Calendar.prototype.goToToday = function()
{
	var oToday = new Date();
	this.goTo(oToday.getMonth(),oToday.getFullYear());
};
Calendar.prototype.goToSelectedDate = function()
{
	this.goTo(this.nMonthSelected,this.nYearSelected);
};
Calendar.prototype.setClasses = function(oClasses)
{
	this.oClasses = oClasses;
	return this;
};
Calendar.prototype.setTexts = function(oTexts)
{
	this.oTexts = oTexts;
	if(this.oWeekDays)
	{
		this.createCalHeader();
		this.oCalendarBody.removeChild(this.oWeekDays);
		var oWeekDays = this._createWeekDays();
		this.oCalendarBody.appendChild(oWeekDays);
		this._changeDaysHot();
	}
	return this;
};
Calendar.prototype._isLeap = function()
{
	return ((this.nYear % 400) === 0) ? 1 :
		((this.nYear % 100) === 0) ? 0 :
		((this.nYear % 4)   === 0) ? 1 :
		 0;
};
Calendar.prototype.daysInFebruary = function()
{
	if(this._isLeap())
	{
		return 29;
	}
	return 28;
};
Calendar.prototype.daysInMonth = function(year)
{
	return [31,this.daysInFebruary(),31,30,31,30,31,31,30,31,30,31];
};
Calendar.prototype.getDate = function()
{
	return new Date(this.nYearSelected,this.nMonthSelected,this.nDaySelected); 
};
Calendar.prototype._createCalendarContainer = function()
{
	var oCalendarContainer = document.createElement("div");
		oCalendarContainer.className = this.oClasses["container"];
	return oCalendarContainer;
};
Calendar.prototype._createCalendarHeader = function()
{
	var oCalendarHeader = document.createElement("div");
		oCalendarHeader.className = this.oClasses["header"];
	this.oHeader = oCalendarHeader;
	return oCalendarHeader;
};
Calendar.prototype._changeMonthYearHot = function()
{
	this.oMonthSpan.innerHTML = this.oTexts.months["long"][this.nMonth];
	this.oYearSpan.innerHTML = this.nYear;
};
Calendar.prototype.addEvent = function(oElement, sType, fpCallback)
{
	if(oElement.attachEvent)
	{
		return oElement.attachEvent("on"+sType, fpCallback);
	}else if(oElement.addEventListener)
	{
		return oElement.addEventListener(sType, fpCallback, false);
	}
};
Calendar.prototype._createPrevControl = function()
{
	var oPrevControl = document.createElement("div");
		oPrevControl.className = this.oClasses["prev"];
	var oPrevLink = document.createElement("a");
		oPrevLink.href = "#";
	var oPrevSpan = document.createElement("span");
		oPrevSpan.innerHTML = this.oTexts["prev"];
	oPrevLink.appendChild(oPrevSpan);
	var self = this;	
	this.addEvent(oPrevLink, "click", function(eEvent)
	{
		self._prevMonth();
		self.onChangeMonth();
	});
	oPrevControl.appendChild(oPrevLink);
	return oPrevControl;
};
Calendar.prototype._prevMonth = function()
{
	this.nMonth--;
	if(this.nMonth < Calendar.JANUARY)
	{
		this.nMonth = Calendar.DECEMBER;
		this.nYear--;
	}
	this.oMonthSpan.innerHTML = this.oTexts.months["long"][this.nMonth];	
	this.oYearSpan.innerHTML = this.nYear;
	this._changeDaysHot();
};
Calendar.prototype._createNextControl = function()
{
	var oNextControl = document.createElement("div");
		oNextControl.className = this.oClasses["next"];
	var oNextLink = document.createElement("a");
		oNextLink.href = "#";
	var oNextSpan = document.createElement("span");
		oNextSpan.innerHTML = this.oTexts["next"];
	oNextLink.appendChild(oNextSpan);
	var self = this;
	this.addEvent(oNextLink, "click", function(eEvent)
	{
		self._nextMonth();
		self.onChangeMonth();
	});
	oNextControl.appendChild(oNextLink);
	return oNextControl;
};
Calendar.prototype._nextMonth = function()
{
	this.nMonth++;
	if(this.nMonth > Calendar.DECEMBER)
	{
		this.nMonth = Calendar.JANUARY;		
		this.nYear++;
	}
	this.oMonthSpan.innerHTML = this.oTexts.months["long"][this.nMonth];
	this.oYearSpan.innerHTML = this.nYear;
	this._changeDaysHot();
};
Calendar.prototype._createMonthYear = function()
{
	var oMonthYear = document.createElement("div");
		oMonthYear.className = this.oClasses["month_year"];
	var oMonthSpan = document.createElement("span");
		oMonthSpan.className = this.oClasses["month"];
		oMonthSpan.innerHTML = this.oTexts.months["long"][this.nMonth];
	this.oMonthSpan = oMonthSpan;
	var oYearSpan = document.createElement("span");
		oYearSpan.className = this.oClasses["year"];
		oYearSpan.innerHTML = this.nYear;
	this.oYearSpan = oYearSpan;
	this.oMonthYear = oMonthYear;
	oMonthYear.appendChild(oMonthSpan);
	oMonthYear.appendChild(oYearSpan);
	return oMonthYear;
};
Calendar.prototype._createCalendarBody = function()
{
	var oCalendarBody = document.createElement("div");
		oCalendarBody.className = this.oClasses["body"];
	this.oCalendarBody = oCalendarBody;
	return oCalendarBody;
};
Calendar.prototype._createWeekDays = function()
{
	var oWeekDays = document.createElement("div");
		oWeekDays.className = this.oClasses["week_days"];
	var oWeekDay = null;
	for(var nDay = this.oLocale.firstDayOfWeek ; nDay < 7; nDay++)
	{	
		oWeekDay = document.createElement("div");
		oWeekDay.innerHTML = this.oTexts["weekDays"]["short"][nDay];
		oWeekDays.appendChild(oWeekDay);
	}
	if(this.oLocale.firstDayOfWeek)
	{
		oWeekDay = document.createElement("div");
		oWeekDay.innerHTML = this.oTexts["weekDays"]["short"][0];
		oWeekDays.appendChild(oWeekDay);
	}
	this.oWeekDays = oWeekDays;
	return oWeekDays;
};
Calendar.prototype._getDayOfWeekFirstDayOfMonth = function()
{
	var oDate = new Date(this.nYear,this.nMonth,1); 
	return oDate.getDay()-this.oLocale.firstDayOfWeek;
};
Calendar.prototype._getDaysInActualMonth = function()
{
	var aDaysInMonth = this.daysInMonth();
	var nDaysInMonth = aDaysInMonth[this.nMonth];
	return nDaysInMonth;
};
Calendar.prototype._createDays = function()
{	
	var nDayOfWeekFirstDayOfMonth = this._getDayOfWeekFirstDayOfMonth();	
	var nDaysInMonth = this._getDaysInActualMonth();
	
	var nDaysContainers = nDayOfWeekFirstDayOfMonth+nDaysInMonth;
	
	var oDays = document.createElement("div");
		oDays.className = this.oClasses["days"];
	var oDay = null,
		oWeek = null,
		oLink=null,
		oSpan =null;
	var oToday = this._checkMonthYear(new Date());
	var oSelectedDate = this._checkMonthYear(this.getDate());
	for(var nDay = 0; nDay < nDaysContainers; nDay++)
	{
		if(nDay%7===0)
		{
			oWeek = document.createElement("div");
			oWeek.className = this.oClasses["week"];
			oDays.appendChild(oWeek);
		}
		oDay = document.createElement("div");
		if(nDay < nDayOfWeekFirstDayOfMonth)
		{
			oDay.innerHTML = "";
		}else
		{
			oDay.className = this.oClasses["day"];
			oSpan = document.createElement("span");
			var nDayInBucle = nDay-nDayOfWeekFirstDayOfMonth+1;
			oSpan.innerHTML = nDayInBucle
			
			if(oSelectedDate == nDayInBucle)
			{
				oDay.className = "selected";
				this.oDaySelected = oDay;
			}
			if(oToday != -1 && nDayInBucle == oToday)
			{
				oDay.className = this.oClasses["today"];
				oDay.appendChild(oSpan);				
			}else
			{			
				oLink = document.createElement("a");
				oLink.href = "#";
				oLink.appendChild(oSpan);
				var self = this;
				this.addEvent(oDay, "click", function(eEvent)
				{
					var oElement = eEvent.target || eEvent.srcElement;
					while(oElement.tagName.toLowerCase() !== "div")
					{
						oElement = oElement.parentNode;
					}
					if(self.oDaySelected)
					{
						self.oDaySelected.className = self.oDaySelected.className.indexOf("today")!=-1?self.oClasses["today"]:self.oClasses["day"];
					}
					oElement.className = "selected";
					self.oDaySelected = oElement;
					self.nDaySelected = parseInt(oElement.getElementsByTagName("span")[0].innerHTML, 10);
					self.nMonthSelected = self.nMonth;
					self.nYearSelected = self.nYear;
					self.onSelectDate();
					if(eEvent.preventDefault)
					{
						eEvent.preventDefault();
						eEvent.stopPropagation();
					}else
					{
						eEvent.cancelBubble = true;
						eEvent.returnValue = false;
					}
				});
				oDay.appendChild(oLink);
			}
		}
		
		oWeek.appendChild(oDay);
	}
	oDay = oWeek = null;
	this.oDays = oDays;
	return oDays;
};
Calendar.prototype._checkMonthYear = function(oDate)
{
	var oDate = oDate;
	var oDay = oDate.getDate();
	var oMonth = oDate.getMonth();
	var oYear = oDate.getFullYear();
	if(this._checkMonth(oMonth) && this._checkYear(oYear))
	{
		return oDay;
	}
	return -1;
};
Calendar.prototype._checkDay = function(nDay)
{
	return this.nDaySelected == nDay;
};
Calendar.prototype._checkMonth = function(nMonth)
{
	return this.nMonth == nMonth;
};
Calendar.prototype._checkYear = function(nYear)
{
	return this.nYear == nYear;
};
Calendar.prototype._changeDaysHot = function()
{
	this.oCalendarBody.removeChild(this.oDays);
	this._createDays();
	this.oCalendarBody.appendChild(this.oDays);
};
Calendar.prototype.createCalHeader = function()
{
	if(!this.oHeader)
	{
		var oCalendarHeader = this._createCalendarHeader();
		
	}else
	{
		this.oHeader.innerHTML = '';
	}
	var oPrevControl = this._createPrevControl();
	var oNextControl = this._createNextControl();
	var oMonthYear = this._createMonthYear();
	this.oHeader.appendChild(oPrevControl);
	this.oHeader.appendChild(oNextControl);
	this.oHeader.appendChild(oMonthYear);
	
	return this.oHeader;
};
Calendar.prototype.insertIntoDOM = function()
{
	var oCalendarContainer = this._createCalendarContainer();
	var oCalendarHeader = this.createCalHeader();
	var oCalendarBody = this._createCalendarBody();
	var oWeekDays = this._createWeekDays();	
	var oDays = this._createDays();	
	oCalendarContainer.appendChild(oCalendarHeader);
	oCalendarBody.appendChild(oWeekDays);
	oCalendarBody.appendChild(oDays);
	
	oCalendarContainer.appendChild(oCalendarBody);
	this.oContainer.appendChild(oCalendarContainer);
};