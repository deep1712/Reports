pragma solidity ^0.4.24;


contract Record {
	//declaring variables
	struct Report{
	 	uint id;
		string date;// unsigned
		string name;
		string disease;
		string prescription;
		string gen;
		uint age;
		address docId;
	}
	mapping(uint => Report) public reports;
	uint public reportsCount;
	event reportedEvent (
		uint indexed reportsCount
	);

	function addReport (string _date,string _name,string _disease,string _prescription,string _gen,uint _age) public {
		reportsCount ++;
		reports[reportsCount] = Report(reportsCount,_date,_name,_disease,_prescription,_gen,_age,msg.sender);
		reportedEvent(reportsCount);
	}


}