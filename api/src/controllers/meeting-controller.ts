import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { getToken } from "../utils/getToken";
import RequestError from "../utils/request-error";

export const createMeeting = async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken();
    const { topic } = req.body;
    let start_time = new Date(req.body.start_time);
    const { duration } = req.body;
    start_time.setHours(start_time.getHours() + 2)

    const data = {
        topic,
        start_time: start_time.toISOString().split('.')[0],
        duration,
        timezone: "Europe/Paris",
        settings: {
            host_video: "true",
            participant_video: "true"
        }
    };

    const headers = {
        "content-type": "application/json",
        "Authorization": `Bearer ${token}`
    }

    await axios.post(`https://api.zoom.us/v2/users/${process.env.API_EMAIL}/meetings`, data, {
        headers: headers
    }).then(result => res.json({
        status: "success",
        message: "Meeting created successfully.",
        response: result && result?.data
    })
    ).catch((e) =>
        next(new RequestError(e.response.data.message, 400)));
};


// gets all meetings of an user
export const getAllMeetings = async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken();
    await axios.get(`https://api.zoom.us/v2/users/${process.env.API_EMAIL}/meetings`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(result => res.json({
        status: "success",
        message: "Fetched All Meetings",
        response: result && result?.data
    })
    ).catch((e) =>
        next(new RequestError(e.response.data.message, 400)));
};