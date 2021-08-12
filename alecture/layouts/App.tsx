
import loadable from '@loadable/component';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));

const App = () => {
    return (
        // Switch는 여러개 router중에 딱 1개만 표시해주는 router이다.
        // ex) login으로 들어가면 위에 2개 라우터는 없는셈.
        <Switch>
            {/* "/"일때 redirect됨 login으로 */}
            <Redirect exact path="/" to="/login" />
            <Route path="/login" component={LogIn} />
            <Route path="/signup" component={SignUp} />
            <div>테스트중ssssssww</div>
        </Switch>
    );
}

export default App;