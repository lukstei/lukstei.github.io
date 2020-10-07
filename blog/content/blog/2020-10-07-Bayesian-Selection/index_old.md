---
title: Bayesian based portfolio selection
tags: ["programming", "react", "javascript"]
author: Lukas Steinbrecher
date: 2019-11-01
---

In the last article, we introduced the Mean/Variance framework, which provides a formulation for selecting efficient portfolios for risky assets. 

Common arguments why the Bayesian portfolio selection approach might be useful are:

- **Prior information:** Pre-known knowledge can be incorporated into the models by using informative prior distributions.

- **Parameter uncertainty:** The Bayesian approach is one way (including other, non Bayesian techniques, see above) to deal with parameter uncertainty. The problem of parameter uncertainty is naturally incorporated by the Bayesian approach by treating the model parameters $\boldsymbol{\mathbf{\Theta}}$ as probability distributions instead of constants. 

- **Convenience of numerical algorithms:** Numerical algorithms allow a more declarative approach, where one can focus on the "modeling" part without worrying on the mathematically convenience and/or tractability of the models.

### The Bayesian framework to portfolio optimization

One can roughly divide Bayesian based approaches to portfolio selection into two groups (\cite{avramov2010bayesian}). The first group treats the asset returns as independent and identically distributed (iid), and concentrates on modeling the return distribution only conditional on the historical returns (e.g. by assuming a Multivariate Gaussian distribution and estimating the $\mu$ and $\Sigma$ parameters). The other group treats the asset returns as time dependent and therefore predictable. One example of such a predictable model is estimating a linear regression model where the return is the dependent variable and the independent variables are based on some economic measure, such as GDP growth and treasury bill rate.

An overview of the state of the art of Bayesian based portfolio selection approach is provided in the introduction in Section \ref{sec:stateofart}.

In this article series, we concentrate on models in group one, i.e. on modeling the return distribution only conditional on the historical returns. In the Bayesian framework, the parameter vector $\boldsymbol{\mathbf{\Theta}}$, which contains all model parameters (e.g. $\boldsymbol{\mathbf{\mu}}$ and $\boldsymbol{\mathbf{\Sigma}}$ in a Multivariate Gaussian distribution setting), is treated as a random variable. For a detailed discussion of Bayesian inference, see Section \ref{sec:bayes-theorem}.

We define the model as the likelihood $p(X \: \vert \: \Theta)$, defining the probability density of the dataset $\boldsymbol{\mathbf{X}}$, given one particular assignment of the parameter vector $\boldsymbol{\mathbf{\Theta}}$, and $p(\Theta)$ the a-priori distribution of $\boldsymbol{\mathbf{\Theta}}$, which includes all knowledge about the parameters a-priori the inference, i.e. before we observe the data. Having a dataset $X$ available at time $t$ (in our case the historical returns of the financial assets up to time $t$), we can use the Bayesian inference formulation to get the a-posteriori distribution density $p(\Theta \: \vert \: X)$:
$$
p(\Theta \: \vert \: X) = \frac{p(X \: \vert \: \Theta) \cdot p(\Theta)}{\int_{\Theta} p(X \: \vert \: \Theta) \cdot p(\Theta) \; d\Theta}
$$

Having the joint posterior densities, we can then integrate out the parameters $\boldsymbol{\mathbf{\Theta}}$ to obtain the predictive return density:
$$
p(R_{t+1} \: \vert \: X) = \int_{\Theta} p(R_{t+1} \: \vert \: \Theta, X) \; d\Theta
$$

Then the Bayesian framework to portfolio optimization can be formulated as a utility maximization of the predictive return distribution (\cite{avramov2010bayesian}):
$$
w_{Bayes} = \argmax_w \int_{R_{t+1}} u(w) \; p(R_{t+1} \: \vert \: X) \; dR_{t+1}
$$

In our case study we use different Bayesian models to estimate $\boldsymbol{\mathbf{\Theta}} \: \vert \: X$, which are further motivated in Section \ref{sec:bayes-models}. We approximate the predictive return density with Markov Chain Monte Carlo by numerically integrating out the parameters. We then calculate the optimal portfolio using direct expected utility optimization (Section \ref{sec:direct-expected-utility}).

### Using the Bayesian framework for Mean/Variance optimization

The Mean/Variance framework uses the first two moments of the return distribution (the expected value $\mu$ and the variance-covariance matrix $\Sigma$) to calculate an efficient portfolio. In a Bayesian setting, we can obtain the expected value $\mu = \mathbb{E}(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X})$ and variance $\Sigma = Var(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X})$ of the predictive return distribution $\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X}$. As \cite{polson2000bayesian} points out, these statistics can be calculated as\footnote{$Var(R_{t+1} \: \vert \: X)$ is decomposed using the law of total variance (see \cite{weiss2005course})}:
$$
\mu = \mathbb{E}(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X}) = \mathbb{E}(\boldsymbol{\mathbf{\mu \: \vert \: X}})\\
\Sigma = Var(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X})\\ 
=\mathbb{E}(Var(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: \mu, \Sigma, X})) + Var(\mathbb{E}(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: \mu, \Sigma, X}))\\
=\mathbb{E}(\boldsymbol{\mathbf{\Sigma \: \vert \: X}}) + Var(\boldsymbol{\mathbf{\mu \: \vert \: X}})
$$

As we can see, we can calculate the expected value for the predictive return distribution using the expected value of the marginal a-posteriori mean $\boldsymbol{\mathbf{\mu \: \vert \: X}}$. For the variance of the predictive return distribution we can use the marginal a-posteriori variance-covariance matrix $\boldsymbol{\mathbf{\Sigma \: \vert \: X}}$, as one would expect, but we have to add an additional term to correct for parameter uncertainty, using the variance of the marginal a-posteriori mean $\boldsymbol{\mathbf{\mu \: \vert \: X}}$. 
This correction is consistent with a correction used for parameter uncertainty in a non-Bayesian setting \citep[e.g., see][]{dangl2017long}. 



\section{Bayesian statistics and Markov Chain Monte Carlo}

We begin this chapter, by showing how the Bayesian theorem (Bayesian formula) is derived, then we take a dive into the concept of Bayesian inference and how it is used to make conclusions using the so called a-posteriori distribution.

We proceed to methods and algorithms to numerically solve the Bayesian inference problem. We will begin by introducing Monte Carlo methods in general and how the use Random Number Generators to answer specific questions. We then proceed to the ideas of Markov Chain Monte Carlo and take a detailed look at two specific MCMC algorithms, namely Metropolis-Hastings and Hamilton Monte Carlo.

In the last section we introduce probabilistic programming languages (PPL), and in particular Stan which is one instance of such a PPL. PPL provide a domain specific language for doing Bayesian inference using MCMC in a declarative and user friendly way.

We use the notation $\mathbf{x}$ (bold) to denote a stochastic variable, vector or matrix, as opposed to $x$ which is an ordinary scalar, vector or matrix.

\subsection{The Bayesian theorem and Bayesian inference}
\label{sec:bayes-theorem}

The goal of Bayesian inference is to make conclusions on a parameter $\prob{\Theta}$ of the model based on observed, fixed data $X$. In the Bayesian world all parameters are random variables. We are usually interested in the so called a-posteriori density function of the parameters conditioned on the observed data $p_{\prob{\Theta \given X}}(\Theta \given x)$, which incorporates all knowledge about the parameters $\prob{\Theta}$ after seeing the data, in particular it tells us, how "probable" each of the possible parameter assignments $\prob{\Theta}$ is. The a-posteriori distribution can be calculated with the Bayesian theorem after defining the likelihood $p(X \given \Theta)$, and $p(\Theta)$ the a-priori distribution of $\prob{\Theta}$.

The Bayesian theorem (Bayesian formula) directly follows from the definitions of conditional probabilities and the law of total probability (\cite{gelman2014bayesian}) and is defined for two continuous random variables $\prob{X}$ and $\prob{\Theta}$ as:

\begin{equation} \label{eq:bayes-theorem}
\begin{split}
p(\Theta \given X) &=  \frac{p(\Theta, x)}{p(X)} \\
 &=  \frac{p(X \given \Theta) \cdot p(\Theta)}{p(X)} \\
 &= \frac{p(X \given \Theta) \cdot p(\Theta)}{\int_{\Theta} p(X \given \Theta) \cdot p(\Theta) \; d\Theta}
\end{split}
\end{equation}

$p(X \given \Theta)$ is the likelihood, defining the probability density of the dataset $\prob{X}$, given one particular assignment of the parameter vector $\prob{\Theta}$.

$p(\Theta)$ is the a-priori distribution of $\prob{\Theta}$ and this distribution includes everything that we know about the parameter a-priori the inference, i.e. before we observe the data. A-priori distribution can be \textit{non-informative}, which can be interpreted as a distribution, which expresses no particular subjective believe about the distribution of $\prob{\Theta}$, although there is no commonly agreed definition of what non-informative prior is and how it should be constructed. The principle of insufficient reason, originally formulated by Bernoulli and Laplace, \cite{sinn1980rehabilitation}, says that, if you know nothing about $\prob{\Theta}$ you should use a probability which assigns equal probability for every possible outcome, i.e. a uniform distribution. This seems an obvious choice, but the use of uniform priors is often problematic because it is improper when using an unbounded parameter space in $\prob{\Theta}$ (\cite{syversveen1998noninformative}). An improper prior doesn't integrate to one, this might or might not be a problem, in some cases the posterior is proper anyways.


As we can see the choice of non-informative priors is not straightforward, often the prior is chosen based on the principles of information theory. One choice is to use a prior distribution which maximizes the entropy, and therefore minimizes the embedded information in the distribution based on some constraints of the parameter space (\cite{shore1980axiomatic}). This is called the principle of maximum entropy (Maxent), for example the probability distribution which maximizes the entropy for the parameter space $(0, \infty)$, with the constraint that the expected value $\mathbb{E}(\prob{\Theta})$ must exist, is the exponential distribution, in contrast, if we relax the constraint and say the expected value doesn't have to exist, the Maxent distribution would be the unbounded uniform distribution (\cite{conrad2013probability}).

Another popular choice is to use Jeffrey's prior (\cite{jeffreys1946invariant}) which chooses a prior such that $p(\Theta) \propto \sqrt{\operatorname{det} \mathbb{I}(\Theta)}$, where $\mathbb{I(\cdot)}$ is the Fisher information, which also is a measure of the amount of information of an random variable.

For practical reasons, often prior distributions are chosen, which make the Bayesian formula analytically tractable. This is done using so called conjugate families (\cite{bernardo1994bayesian}). An a-priori distribution is chosen (the conjugate prior), so that the a-posteriori distribution has the same "structure" (distribution family) as the a-priori distribution, and therefore making to solve the Bayesian formula convenient. When using a Hamilton Monte Carlo algorithm, analytical tractability is no issue, so the a-priori distribution can be chosen which best represents the a-priori knowledge, whether it is analytically tractable or not.


