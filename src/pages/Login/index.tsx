import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import FormField from '../../components/FormField';
import Button from '../../components/Button';
import PageDefault from '../../components/PageDefault';

import useForm from '../../hooks/useForm';

import iconRecovery from '../../assets/images/icons/recoveryPassword.svg';

import { Title, Description, Form, FieldsWrapper, LinkLogin } from './styled';

function Login() {
  const valuesInitials = {
    username: '',
    password: '',
  };

  const history = useHistory();
  const { handleChange, values } = useForm(valuesInitials);

  function loginStudent() {
    api
      .post('/aluno/validarLoginAluno', {
        usuario: values.username,
        senha: values.password,
      })
      .then((response) => {
        const { data } = response;
        console.log(data);

        history.push('/student/home');
      })
      .catch(({ response }) => {
        const { data } = response;
        alert(data);
      });
  }

  return (
    <PageDefault>
      <Title>Entre</Title>
      <Description>Deixe seu aprendizado mais engajado</Description>

      <Form>
        <FieldsWrapper>
          <FormField
            label="Usuário"
            name="username"
            value={values.username}
            onChange={handleChange}
          />
          <FormField
            label="Senha"
            name="password"
            value={values.password}
            onChange={handleChange}
          >
            <Link to="/recoveryPassword" title="Recuperar sua senha">
              <img src={iconRecovery} alt="Ícone para recuperação de senha" />
            </Link>
          </FormField>
        </FieldsWrapper>
        <Button onClick={loginStudent}>Entrar</Button>
      </Form>
      <LinkLogin to="/newRegister" title="Cadastre-se agora mesmo">
        Não tem cadastro? <b>Venha com a gente</b>
      </LinkLogin>
    </PageDefault>
  );
}

export default Login;
