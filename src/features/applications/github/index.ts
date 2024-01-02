/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import { NewCommitEventApplicationService } from './github.event-application-service';
import { EventApplicationService } from '../events/interfaces/event-application-service';

const githubEventApplicationServices: EventApplicationService[] = [
  new NewCommitEventApplicationService(),
];

export default githubEventApplicationServices;
