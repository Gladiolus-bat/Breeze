import { createContext, useContext, useEffect, useState } from "react";
import {registerUser, loginUser, fetchCurrentUser} from "../api/auth.js";