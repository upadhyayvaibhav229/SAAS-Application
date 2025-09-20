import { useContext } from "react"
import { AppContext } from "../Context/AppContext"
import axios from "axios";

export const useDashboardService = () => {
    const { backendUrl } = useContext(AppContext);

    const getDashboardData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/dashboard`, {
                withCredentials: true,

            });
            return response.data.data;

        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to fetch dashboard data");

        }
    }
}