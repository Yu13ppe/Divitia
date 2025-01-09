import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { Recover } from "../Pages/Recover";
import { RecoverUpdate } from "../Pages/RecoverUpdate";
import { Dashboard } from "../Pages/Dashboard";
import { Changes } from "../Pages/Changes";
import {TermsAndConditions} from "../Pages/TermsAndConditions";
import {DiviAdm} from "../Pages/DiviAdm";
import {FAQs} from "../Pages/Faqs";
import { Privacy }  from "../Pages/Privacy";
import { Recharge } from "../Pages/Recharge";
import { SendMoney } from "../Pages/SendMoney";
import { Directory } from "../Pages/Directory";
import { Movements} from "../Pages/Movements";

const routes = [
 {
    title: "Privacy",
    path: "/Privacy",
    component: Privacy, 
 },
 {
  title: "Movements",
  path: "/Movements",
  component: Movements,
 },
 {
  title: "Directory",
  path: "/Directory",
  component: Directory,
 },
 {
  title: "SendMoney",
  path: "/SendMoney",
  component: SendMoney,
 },
 {
  title: "Recharge",
  path: "/Recharge",
  component: Recharge,
 },
  {
    title: "TermsAndConditions",
    path: "/TermsAndConditions",
    component: TermsAndConditions,
  },
  {
    title: "Login",
    path: "/Login",
    component: Login,
  },
  {
    title: "Register",
    path: "/Register",
    component: Register,
  },
   {
    title: "Recover",
    path: "/Recover",
    component: Recover,
  },
  {
    title: "RecoverUpdate",
    path: "/RecoverUpdate/:id/:email",
    component: RecoverUpdate,
  },
  {
    title: "Dashboard",
    path: "/Dashboard",
    component: Dashboard,
  },
  {
    title: "Changes",
    path: "/Changes",
    component: Changes,
  },
  {
    title: "DiviAdm",
    path: "/DiviAdm",
    component: DiviAdm,
  },
  {
    title: "FAQs",
    path: "/Faqs",
    component: FAQs,
  },
  {
    title: "",
    path: "/",
    component: Home,
  },
  
];

export default routes;
