import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import Chart from 'chart.js';

import PageStudent from '../../../../components/PageStudent';
import Question from './components/Question';

import { useAuth } from '../../../../contexts/auth';
import api from '../../../../services/api';

import {
  HistoryQuestions,
  ResultsWrapper,
  AverageClass,
  SubTitle,
  Graph,
  Value,
  Medal,
  Info,
} from './styled';

import {
  IResultPage,
  IResultStudent,
  IResponseStudent,
  IResultStudentApi,
  IResponseAllStudents,
} from './interface';

const Result: React.FC<IResultPage> = ({ movQuizId }) => {
  const [resultStudent, setResultStudent] = useState<IResultStudent>(
    {} as IResultStudent
  );

  const { user } = useAuth();
  const { addToast } = useToasts();

  function handleSetDataInGraph() {
    if (!resultStudent.responseAllStudents) return;

    let labelsChart = resultStudent.responseAllStudents.map(
      (student) => student.numberQuestion
    );

    const canvas = document.getElementById(
      'studentsChart'
    ) as HTMLCanvasElement;

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: labelsChart.map((label) => `Pergunta ${label}`),
        datasets: [
          {
            label: 'Média de Acertos',
            data: resultStudent.responseAllStudents.map(
              (student) => student.totalCorrect
            ),
            pointBackgroundColor: '#4CC9F0',
            backgroundColor: 'rgba(76, 201, 240, .24)',
            borderColor: '#4CC9F0',
            borderWidth: 1,
            showLine: true,
          },
        ],
      },
      options: {
        legend: {
          align: 'start',
          labels: {
            fontColor: '#FFF',
            padding: 24,
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                color: 'rgba(76, 201, 240, .24)',
              },
            },
          ],
        },
      },
    });
  }

  function handleGetResultStudent() {
    if (!user) return;

    api
      .get(
        `VWClassificacaoQuiz/movQuizId=${movQuizId}&alunoId=${user?.studentId}`
      )
      .then((response) => {
        if (response.status === 206) {
          addToast(response.data, {
            appearance: 'warning',
            autoDismiss: true,
          });
          return;
        }

        const resultApi = response.data as IResultStudentApi;

        const responseAllStudents = resultApi.respostasDemaisAlunos.map(
          (student) => {
            const responseCurrentStudent = {
              numberQuestion: student.numeroPergunta,
              totalCorrect: student.quantidadeAcertos,
            } as IResponseAllStudents;

            return responseCurrentStudent;
          }
        );

        const responseStudent = resultApi.respostasAlunoAtual.map((student) => {
          const responseCurrentStudent = {
            content: student.enunciado,
            correct: student.acertou,
            descriptionCorrect: student.descricaoAlternativaCorreta,
            descriptionSelection: student.descricaoAlternativaSelecionada,
            nivel: student.ePesoPergunta,
            numberQuestion: student.numeroPergunta,
            points: student.pontuacao,
          } as IResponseStudent;

          return responseCurrentStudent;
        });

        const newResult = {
          description: resultApi.descricao,
          nameStudent: resultApi.nomeAluno,
          points: resultApi.pontuacao,
          totalCorrect: resultApi.quantidadeAcertos,
          totalError: resultApi.quantidadeErros,
          responseAllStudents,
          responseStudent,
        } as IResultStudent;

        setResultStudent(newResult);
      })
      .catch((err) => {
        console.error(err);
        addToast(
          'Houve algum erro inesperado ao obter resultado do aluno, tente novamente mais tarde',
          {
            appearance: 'error',
            autoDismiss: true,
          }
        );
      });
  }

  useEffect(handleSetDataInGraph, [resultStudent]);

  useEffect(handleGetResultStudent, [user, movQuizId]);

  return (
    <PageStudent type="back" text="Resultado">
      <ResultsWrapper>
        <Info>
          <SubTitle>Pontuação total</SubTitle>
          <Value>{resultStudent.points}</Value>
          <SubTitle>Acertos</SubTitle>
          <Value>{resultStudent.totalCorrect}</Value>
          <SubTitle>Erros</SubTitle>
          <Value>{resultStudent.totalError}</Value>
        </Info>
        <Medal></Medal>
      </ResultsWrapper>
      <AverageClass>
        <SubTitle>Média da turma</SubTitle>
        <Graph id="studentsChart"></Graph>
      </AverageClass>
      <HistoryQuestions>
        <SubTitle>Histórico de perguntas</SubTitle>
        <Question responseStudent={resultStudent.responseStudent} />
      </HistoryQuestions>
    </PageStudent>
  );
};

export default Result;
