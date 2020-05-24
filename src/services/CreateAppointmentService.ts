import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentRepository);
    const appointmentDate = startOfHour(date);

    const appointmentInSameDate = await appointmentRepository.findByDate(
      appointmentDate,
    );

    if (appointmentInSameDate) {
      throw new AppError('Horário já reservado');
    }

    const appointment = appointmentRepository.create({
      provider_id,
      date,
    });
    await appointmentRepository.save(appointment);

    return appointment;
  }
}
export default CreateAppointmentService;
