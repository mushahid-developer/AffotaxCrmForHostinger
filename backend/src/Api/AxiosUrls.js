//BaseUrl
// export const BaseUrl = 'https://affotax-crm.herokuapp.com/api/'; // Live
export const BaseUrl = 'http://192.168.18.59:7878/api/'; // Local

//Auth
export const Login = 'login';
export const addEmployeeUrl = 'users/add';
export const getEmployeeUrl = 'users/get/all';

//Clients
export const getClientsUrl = BaseUrl + 'clients/get/all';
export const updateClientPreData = "client/get/one/predata/"
export const updateClient = "client/one/update/"
export const deleteClientUrl = "client/one/delete"
export const ActiveInactiveUrl = "client/one/active/inactive"

//JobPlanning
export const jobPlanning = BaseUrl + 'job/get/all';

//Add Job Pre Data
export const addJobPreData = 'job/add/predata';

//Add Job
export const addJob = 'job/client/add';

//Update one Job
export const JobPlaning_Update_One_Url = 'job/planing/edit';


//Get All Clients
export const GetAllClients = 'clients/get/all';
export const GetAllClientsWthBaseUrl = BaseUrl + 'clients/get/all';

//Timer
export const timerStateUrl = 'timer/check';
export const timerStartStopUrl = 'timer/start_stop';
export const timerReportUrl = 'timer/report';

//Leads
export const LeadsGetAllUrl = 'leads/get/all';
export const leadEditUrl = 'leads/add/edit';
export const leadDeleteUrl = 'leads/delete';
export const wonLostUrl = 'leads/won/lost';


