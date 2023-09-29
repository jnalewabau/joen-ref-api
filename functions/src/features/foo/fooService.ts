import { newHttpFunction } from '../common/firebase/cloudFunctionExpressMapper';

import * as express from 'express';
import { listFoos } from './listFoos';
import { createFoo } from './createFoo';
import { readFoo } from './fetchFoo';
import { deleteFoo } from './deleteFoo';
import { updateFoo } from './updateFoo';
import { authenticatePartner } from '../common/express/authenticatePartner';
// import { initialiseFirebaseApp } from '../common/firebase/initialiseFirebaseApp';
// import { authenticatePartnerKey } from '../../middleware/partnerApis/authenticatePartnerKey';

// initialiseFirebaseApp();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const v1Routes = express.Router();
const routes = express.Router();

routes.get('/foo', listFoos);
routes.post('/foo', createFoo);
routes.get('/foo/:id', readFoo);
routes.patch('/foo/:id', updateFoo);
routes.delete('/foo/:id', deleteFoo);

v1Routes.use('/v1', routes);

app.use(authenticatePartner);
app.use(v1Routes);

export const fooService = newHttpFunction(app);
