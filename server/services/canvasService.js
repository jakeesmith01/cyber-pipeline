import 'dotenv/config';
import axios from 'axios';
import logger from '../configs/logger.js';
import { response } from 'express';

const canvasService = {
    /**
     * Gets the course progress for a teacher in a course 
     * @param {string} courseID 
     * @param {string} teacherID 
     * @returns {object} - The course progress option for the teacher, structure found here: https://lms.au.af.edu/doc/api/courses.html
     */
    async getCourseProgress(courseID, teacherID){
        if (process.env.CANVAS_ENABLED) {
            try{
                const response = await axios.get(`${process.env.CANVAS_URL}/api/v1/courses/${courseID}/users/${teacherID}/progress`, {
                    headers: { Authorization: `Bearer ${process.env.CANVAS_TOKEN}`}
                });
                return response;
            } catch(error){
                if(error.response.status === 401){
                    logger.error('Canvas API is not configured in server/.env');
                    const response = {status: 401, data: {message: 'Canvas API is not configured'}};
                    return response;
                }else{
                    logger.error('Failed to get courses: ' + error);
                    const response = {status: 503, data: {message: 'Failed to get courses'}};
                    return response;
                }
            }
        }
        else{
            logger.error('Canvas Token NOT defined in server/.env, Canvas API disabled');
            return response.status(500).json({message: 'Canvas API disabled'});
        }
    },
    /**
     * Enrolls a teacher in a course
     * @param {string} courseID 
     * @param {string} teacherID 
     * @returns An enrollment object (https://lms.au.af.edu/doc/api/enrollments.html) which can be used to check the status of the enrollment
     * @throws {Error} - If the enrollment fails
     * @throws {Error} - If the Canvas API is not configured
     */
    async enrollTeacherInCourse(courseID, teacherID){
        if(process.env.CANVAS_ENABLED){
            try{
                const response = await axios.post(
                    `${process.env.CANVAS_URL}/api/v1/courses/${courseID}/enrollments`,
                    {
                        enrollment:{
                            user_id: teacherID,
                            type: 'StudentEnrollment',
                            enrollment_state: 'active'
                        },
                        headers:{
                            Authorization: `Bearer ${process.env.CANVAS_TOKEN}`
                        }
                        
                    }
                );

                return response;
            } catch(error){
                if(error.response.status === 401){
                    logger.error('Canvas API is not configured in server/.env')
                    return;
                }
                else{
                    logger.error(`Failed to enroll user ${teacherID} into course ${courseID}`);
                }
            }
        }
    }
}

export default canvasService;