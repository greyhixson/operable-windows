import { app } from '@/store/store';
import { getDatabase, ref, set } from 'firebase/database';

const database = getDatabase(app);
