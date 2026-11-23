import createUseLocalState from './createUseLocalState';

export type UserListFilter = 'all' | 'raisedHands';

const initialUserListFilter: UserListFilter = 'all';
const [useUserListFilter, setUserListFilter] = createUseLocalState<UserListFilter>(initialUserListFilter);

export default useUserListFilter;
export { setUserListFilter };
