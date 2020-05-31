import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '@modules/appointments/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/users/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentRepository = new AppointmentsRepository();
appointmentsRouter.use(ensureAuthenticated);
// appointmentsRouter.get('/', async (request, response) => {
//   const appointmentRepository = getCustomRepository(AppointmentsRepository);
//   const appointments = await appointmentRepository.find();
//   return response.status(200).json(appointments);
// });

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;
  const paserdDate = parseISO(date);
  const createAppointment = new CreateAppointmentService(appointmentRepository);

  const appointment = await createAppointment.execute({
    date: paserdDate,
    provider_id,
  });

  return response.status(200).json(appointment);
});

export default appointmentsRouter;