import Realm from 'realm';
import RepositorioSchema from '../schemas/RepositorioSchema';

export default function getRealm() {
  return Realm.open({
    schema: [RepositorioSchema],
  });
}
